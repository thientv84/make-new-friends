class ApplicationController < ActionController::Base
  protect_from_forgery
  
  include RestGraph::RailsUtil
  
  before_filter :filter_setup_rest_graph
  
  private

  def filter_setup_rest_graph
    scope = []
    # scope << 'read_stream'
    scope << 'friends_online_presence'    
    rest_graph_setup( :auto_authorize         => true                 , 
                      :write_session          => true                 ,
                      # :write_cookies          => false              , 
                      # :write_handler          =>
                      #    lambda{ |fbs| @cache[uid] = fbs }          ,
                      # :check_handler          =>
                      #    lambda{       @cache[uid] }                ,
                      :auto_authorize_scope   => scope.join(',')
                    )
  end
end
